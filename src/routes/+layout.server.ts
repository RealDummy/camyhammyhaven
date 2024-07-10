import type { LayoutServerLoad} from './$types';

const nested_content = import.meta.glob("../content/*/*.md")
const flat_content = import.meta.glob("../content/*.md")

export const load: LayoutServerLoad = async () => {
    let pages: {
        [k:string]: {href: string, name: string}[] | string
    } = {}

    for(let md in nested_content) {
        let split = md.split('/');
        let folder = split[split.length - 2];
        let filename = split[split.length - 1];
        let page_name = filename.split(".")[0];
        let page_loc = '/content/' + folder + '/' + page_name;
        if(!(folder in pages)) {
            pages[folder] = [];
        }
        let entry = pages[folder];
        if ( typeof entry === "string") {
            throw "unexpected"
        }
        else {
            entry.push({href:page_loc, name:page_name});
        }
    }
    for (let md in flat_content) {
        let split = md.split('/');
        let filename = split[split.length - 1];
        let page_name = filename.split(".")[0] ?? "";
        let page_loc = '/content/' + page_name
        if(!(page_name in pages)) {
            pages[page_name] = page_loc;
            continue;
        }
        throw `file ${filename} present, but folder ${page_name} exists and is not empty`;
    }
    
    return {
        pages
    };
  }
  