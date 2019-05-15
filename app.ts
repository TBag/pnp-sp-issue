// The issue could be fixed by uncommenting the follow code
// import { patch } from './patch'
// patch();

import { sp, Web } from "@pnp/sp";
import { Client as GraphClient } from "@microsoft/microsoft-graph-client";

import { settings } from './Settings'
import { AdalCertFetchClient } from './AdalCertFetchClient'

GraphClient.initWithMiddleware({ authProvider: null})

sp.setup({
    sp: {
        fetchClientFactory: () => new AdalCertFetchClient(
            settings.tenantId, 
            settings.clientId, 
            settings.certificate, 
            settings.thumbprint, 
            settings.sharepoint_resource)                
    },
});

const web = new Web("https://tenant.sharepoint.com/sites/sitename1");

web.getFileByServerRelativeUrl("/sites/sitename1/Templates/original.png").getBuffer().then(buffer => {
    web.getFolderByServerRelativeUrl("/sites/sitename1/Templates").files.add("new.png", buffer, true).then(fileAddResult =>{
        console.log('File was uploaded successfully!')
    })
})
