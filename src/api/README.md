# API Layer

Layer ini menjadi pintu masuk seluruh komunikasi frontend ke backend:

- `client/`: HTTP client dasar, interceptor, auth token, error normalizer
- `modules/`: endpoint per domain
- `types/`: DTO request/response terpusat

Semua feature sebaiknya mengakses backend melalui layer ini.
