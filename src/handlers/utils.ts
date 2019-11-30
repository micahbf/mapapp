export const cacheHeader       = {'Cache-Control': 'max-age=120'}
export const contentTypeHeader = {'Content-Type': 'application/json'}
export const corsHeaders       = {'Access-Control-Allow-Origin': '*'}
export const defaultHeaders    = {...cacheHeader, ...contentTypeHeader, ...corsHeaders}
export const postHeaders       = {...contentTypeHeader, ...corsHeaders}
