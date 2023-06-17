import Common from './lib/Common';
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const { pathname } = new URL(request.url);
//		const envKey = env.API_KEY;
//console.log("envKey=", envKey);
		const errorObj = {ret: "NG", messase: "Error"};
		const retObj = {ret: "OK", data:{} , messase: "Error"};
		//
//console.log("#env");
//console.log(env);
		if (request.method === "GET") {
		}
		if (request.method === "POST") {
			const json: any = JSON.stringify(await request.json());
			const reqObj: any = JSON.parse(json);
			const validApiKey = await Common.validApiKey(env, reqObj);
   		    console.log(validApiKey);
			if(!validApiKey) {
				errorObj.messase = "Error, Common.validApiKey=false";
				console.log("Error, Common.validApiKey=false");
				return Response.json(errorObj);
			}
//console.log("pathname=", pathname);
console.log(reqObj);
			const contentType = request.headers.get("content-type");
			if(contentType !== "application/json") {
				console.log("contentType=", contentType);
				return Response.json({ret: "NG", messase: "Error, contentType <> application/json"});
			}	
			//Router
			if (pathname === "/put") {
				await env.MY_KV.put(reqObj.key, reqObj.value);
				return Response.json(retObj);
			}
			if (pathname === "/get") {
				let value = await env.MY_KV.get(reqObj.key);
				if(!value) {
					return Response.json(errorObj);
				}
				retObj.data = value;
				return Response.json(retObj);
			}
			if (pathname === "/delete") {
				await env.MY_KV.delete(reqObj.key);
				return Response.json(retObj);
			}
		}
		//
		return new Response("Hello World!");
	},
};
