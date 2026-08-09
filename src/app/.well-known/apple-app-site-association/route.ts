const appleAppSiteAssociation = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "8549XWR89L.com.thepxgroup.vj",
        paths: ["/shared-lesson", "/shared-lesson/*", "/l/*"],
        components: [
          {
            "/": "/shared-lesson",
            comment: "PX VJ shared lesson links",
          },
          {
            "/": "/l/*",
            comment: "PX VJ short shared lesson links",
          },
        ],
      },
    ],
  },
};

export function GET() {
  return Response.json(appleAppSiteAssociation, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
