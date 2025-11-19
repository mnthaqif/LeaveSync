# ...
jobs:
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # (If you generate a lockfile or do Node tasks before Docker, keep setup-node here)

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push backend image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: backend/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/leavesync-backend:latest
            ghcr.io/${{ github.repository_owner }}/leavesync-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
