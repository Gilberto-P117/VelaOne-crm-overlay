import { getDataIdValuesFromIframe } from "../../crm/crmIframeDom";

export const QUOTE_RELATED_RECORD_SELECTORS = {
    billingAccountId: "#billing_account_id",
    corporateAccountId: "#c1183_corporate_accounts_id_c",
    billingContactId: "#billing_contact_id",
};

export function getQuoteRelatedRecordIdsFromIframe() {
    const result = getDataIdValuesFromIframe(QUOTE_RELATED_RECORD_SELECTORS);
    setQuotePayload(result);
    

    console.log(result);
}