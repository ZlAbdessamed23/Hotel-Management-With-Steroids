import { MetadataRoute } from "next";


export default function robots() : MetadataRoute.Robots {
    const baseUrl : string = "";

    return {
        rules : {
            userAgent : '*',
            allow : ["/" , "/login" , "/register"],
            disallow : ["/main/"],
        },
        sitemap : `${baseUrl}/sitemap.xml`
    }

  
};