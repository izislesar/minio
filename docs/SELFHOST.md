# minio selfhost notes

S3-compatible storage. Role here: backup staging for the fleet —
restic and plain dumps land in buckets, weekly sync goes offsite.
~100mb ram. Manual runs.

## up

```bash
cp selfhost/.env.example selfhost/.env
docker compose -f selfhost/docker-compose.yml --env-file selfhost/.env up -d
```

console: http://localhost:8104 (loopback-bound), s3 api: :8101.

create a bucket per service (`linkding-backups`, `vaultwarden-backups`...),
one access key per writer (console → access keys), never share the root key.

## restic example

```bash
export AWS_ACCESS_KEY_ID=<key> AWS_SECRET_ACCESS_KEY=<secret>
restic -r s3:http://localhost:8101/linkding-backups init
restic -r s3:http://localhost:8101/linkding-backups backup ~/backups
```

## SLO

see selfhost/SLO.md. Fill in the offsite line — unstated offsite means
no durability story.

## update

pull + up -d. Data format is stable across minors; majors announce loudly.
