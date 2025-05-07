interface AppConfig {
    VERSION: string;
    TITLE: string;
    DOMAIN: string;
    ITEM_BATCH: string;
    Dev: string;
    production: string;
}

const appConfig: AppConfig = {
    VERSION: "1.0.0",
    TITLE: "ERP_APP",
    DOMAIN: "https://apps.elalfyco.com/erpapi/",
    ITEM_BATCH:"inventory/get-item-batches-with-stocktaking",
    Dev: "development",
    production: "production"
};

export default appConfig;