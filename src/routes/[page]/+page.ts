
import { error } from "@sveltejs/kit";

export async function load({ params }) {
    
    try {
		const post = await import(`../../content/${params.page}.md`);

        return {
			content: post.default,
			meta: post.metadata
		}

	} catch (e) {
		throw error(404, `Could not find ${params.page}`)
	}


    
}