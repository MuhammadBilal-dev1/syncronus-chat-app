{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/apps/server/api/$1"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/apps/client/$1"
    }
  ]
}