import * as signalR from "@microsoft/signalr";
import { SIGNALR_URL } from "../../api/client";

export type StockUpdateEvent = {
  outletId: string;
  updates: {
    productId: string;
    qty: number;
  }[];
};

type StockUpdateHandler = (event: StockUpdateEvent) => void;

export function createRealtimeClient() {
  let connection: signalR.HubConnection | null = null;
  let currentOutletId: string | null = null;
  const handlers = new Set<StockUpdateHandler>();

  function emitStockUpdate(event: StockUpdateEvent) {
    handlers.forEach((handler) => handler(event));
  }

  async function ensureConnection(accessToken?: string) {
    if (!connection) {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_URL, {
          accessTokenFactory: () => accessToken ?? "",
        })
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveStockUpdate", (event: StockUpdateEvent) => {
        emitStockUpdate(event);
      });
    }

    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start();
    }
  }

  async function joinOutletGroup(outletId: string) {
    if (!connection) {
      return;
    }

    await connection.invoke("JoinOutletGroup", outletId);
    currentOutletId = outletId;
  }

  async function connect(outletId: string, accessToken?: string) {
    await ensureConnection(accessToken);

    if (currentOutletId && currentOutletId !== outletId) {
      await connection?.invoke("LeaveOutletGroup", currentOutletId);
    }

    await joinOutletGroup(outletId);
  }

  async function disconnect() {
    if (!connection) {
      currentOutletId = null;
      return;
    }

    if (currentOutletId) {
      try {
        await connection.invoke("LeaveOutletGroup", currentOutletId);
      } catch {
        // ignore leave errors on disconnect
      }
    }

    currentOutletId = null;
    await connection.stop();
  }

  function onStockUpdate(handler: StockUpdateHandler) {
    handlers.add(handler);

    return () => {
      handlers.delete(handler);
    };
  }

  return {
    connect,
    disconnect,
    joinOutletGroup,
    onStockUpdate,
  };
}
