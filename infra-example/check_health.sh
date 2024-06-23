#!/bin/sh
docker ps --format "table {{.Names}}\t{{.Status}}" --filter "status=running"
