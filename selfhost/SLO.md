# minio SLO

Backup target for the fleet. Losing data here silently is the worst
failure mode in the whole setup — so the SLOs watch durability signals,
not just uptime.

## SLI/SLO (30d window)

| signal | SLI | SLO |
|---|---|---|
| availability | `probe_success{job="minio"}` on `/minio/health/live` | 99.5% |
| write success | k6 put-object check rate | 99.9% |
| read success | k6 get-object check rate | 99.9% |
| disk free | `minio_cluster_capacity_usable_free_bytes` | > 20% (alert, not slo) |

## error budget

99.5% ≈ 3.6h/30d. Any failed backup write (restic/rclone exit != 0)
counts against the budget manually — note it in the backup log.

## single-drive honesty

one drive = no erasure coding. This is a backup *staging* area, not
the offsite copy. Weekly sync offsite or the durability story is fiction.
Write down where the offsite is: _______________ (fill this in).

## measuring

- `/minio/health/live` and `/minio/health/ready` for up.
- k6 (`k6/load.js`) does put → get → delete with a random bucket.
- `mc admin prometheus generate` gives the scrape config for real metrics.
