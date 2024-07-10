
export const prerender = true;


import { error } from "@sveltejs/kit";

export async function load({ params }) {
    
    try {
		console.log(params.page, "dskujfhkjdfs");
		const post = await import(`/src/content/${params.path != null ? params.path + '/' : ''}${params.page}.md`);
		console.log("hi", params);
        return {
			content: post.default,
			meta: post.metadata
		}

	} catch (e) {
		throw error(404, `Could not find ${JSON.stringify(params)}`)
	}
}