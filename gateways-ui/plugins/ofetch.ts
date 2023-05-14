import {FetchContext, FetchResponse, ofetch} from 'ofetch'
import {useAuthStore} from "~/stores/auth";
import {navigateTo, useRuntimeConfig} from "#app";

export default defineNuxtPlugin((_nuxtApp) => {
    const baseUrl = useRuntimeConfig().public.baseURL;
    globalThis.$fetch = ofetch.create({
        onRequest(x) {
            x.options.baseURL = baseUrl
        },
        onRequestError({error}) {
            console.error('plugin fetch:', error)
            navigateTo('/error');
        },
        onResponseError(context: FetchContext & { response: FetchResponse<ResponseType> }): Promise<void> | void {
            if (context.response.status > 500)
                navigateTo('/error');
        }
    })
})
