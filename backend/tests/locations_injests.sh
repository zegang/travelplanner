#!/usr/bin/env sh
curl -X POST http://localhost:5000/api/locations \
  -H "Content-Type: application/json" \
  -d '{"name": "Paris", "date": "2025-11-11", "description": "Holiday trip", "image": "paris.jpg"}'
