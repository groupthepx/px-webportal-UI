<!-- PRODUCTION -->
<!-- Local -->

docker buildx build --platform linux/amd64 -t thepxgroup/the-px-group:pg-group-webportal --push .

<!-- Server -->

sudo docker pull thepxgroup/the-px-group:pg-group-webportal

sudo docker compose -f docker-compose.yaml up -d


docker login -u groupthepx@gmail.com
# ใส่ password: PG##@2025
# แล้ว push image ที่ build ไว้แล้ว (ไม่ต้อง build ใหม่)
docker push thepxgroup/the-px-group:pg-group-webportal

<!-- UAT -->
<!-- Local -->

docker buildx build --platform linux/amd64 -t thepxgroup/the-px-group:pg-group-webportal-dev --push .

<!-- Server -->

sudo docker pull thepxgroup/the-px-group:pg-group-webportal-dev

sudo docker compose -f docker-compose.yaml up -d


docker login -u groupthepx@gmail.com
# ใส่ password: PG##@2025
# แล้ว push image ที่ build ไว้แล้ว (ไม่ต้อง build ใหม่)
docker push thepxgroup/the-px-group:pg-group-webportal-dev