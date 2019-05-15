import { AuthenticationContext } from "adal-node";
import { AADToken } from "@pnp/nodejs";
import { combine, HttpClientImpl, objectDefinedNotNull, extend, isUrlAbsolute } from "@pnp/common";
import { default as fetch } from "node-fetch";

// https://github.com/pnp/pnpjs/blob/dev/packages/nodejs/src/net/adalfetchclient.ts
export class AdalCertFetchClient implements HttpClientImpl  {

    private authContext: any;

    constructor(private tenant: string,
        private clientId: string,
        private certificate: string,
        private thumbprint: string,
        private resource = "https://graph.microsoft.com",
        private authority = "https://login.microsoftonline.com/") {
        this.authContext = new AuthenticationContext(combine(this.authority + this.tenant));
    }

    public fetch(url: string, options: any): Promise<Response> {

        if (!objectDefinedNotNull(options)) {
            options = {
                headers: new Headers(),
            };
        } else if (!objectDefinedNotNull(options.headers)) {
            options = extend(options, {
                headers: new Headers(),
            });
        }

        if (!isUrlAbsolute(url)) {
            url = combine(this.resource, url);
        }

        return this.acquireToken().then(token => {
            options.headers.set("Authorization", `${token.tokenType} ${token.accessToken}`);
            return fetch(url, options);
        });
    }

    public acquireToken(): Promise<AADToken> {
        return new Promise((resolve, reject) => {
            this.authContext.acquireTokenWithClientCertificate(this.resource, this.clientId, this.certificate, this.thumbprint,
                (err: any, token: AADToken) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
}
