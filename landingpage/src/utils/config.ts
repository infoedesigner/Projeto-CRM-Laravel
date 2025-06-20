import { GetServerSidePropsContext } from 'next';

export function getHostFromContext(context: GetServerSidePropsContext): string | undefined {
    if (context && context.req && context.req.headers) {
        if(context.req.headers.host !== 'localhost:3000'){
            if(context.req.headers.host === 'homolog-lp.ccef.com.br'){
                return 'https://api-homolog.ccef.com.br';
            }else{
                return 'https://api.ccef.com.br';
            }
        }else{
            return 'http://127.0.0.1:8000';
        }
    }

    return undefined;
}
