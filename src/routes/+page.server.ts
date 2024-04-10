import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

import type { HTMLImgAttributes } from 'svelte/elements';

const PASSWORD = env.SM_PASSWORD;
const USERNAME = env.SM_USERNAME;
const ACCOUNT = env.SM_ACCOUNT;

interface Animal {
  id: number;
  name: string;
}

const DATA_INVALIDATION_TIME = 1000 * 60 * 2;

export type DataT = {info: Animal, image: HTMLImgAttributes};

class AnimalCache {
  data: DataT[] = [];
  last_fetch: number = 0;

  async load() {

    if(this.validateCache()) {
      return;
    }
    console.log("reloading cache!");
    this.data.splice(0, this.data.length);

    let res = await fetch(`https://us06b.sheltermanager.com/service?method=json_adoptable_animals&username=${USERNAME}&password=${PASSWORD}&account=${ACCOUNT}`);
    let json = await res.json();
    if(!(json instanceof Array)) {
      throw json;
    }
    this.last_fetch = Date.now();

    for(let animal of json) {
      if( !this.filterAnimal(animal) ) {
        continue;
      }
      this.data.push(this.createAnimal(animal));
    }
    
  }

  createAnimal(jsonObj: any): DataT {
    return {
      info: {
        id: parseInt(jsonObj["ID"]),
        name: jsonObj["ANIMALNAME"],
      },
      image: {
          src: `https://us06b.sheltermanager.com/service?method=animal_image&animalid=${jsonObj["ID"]}&account=${ACCOUNT}`,
          alt: jsonObj["ANIMALNAME"],
          title: jsonObj["ANIMALNAME"],
      }
    }
  }

  filterAnimal(animal: any): boolean {
    return (animal["BREEDNAME"] == "Guinea Pig" || 
      animal["ANIMALNAME"] == "Hamsters")
      && animal["DISPLAYLOCATION"] != "SHELTER"
  }

  validateCache(): boolean {
    return this.data.length !== 0 && this.last_fetch > Date.now() - DATA_INVALIDATION_TIME;
  }
  
};

const pigs = new AnimalCache();

const pig_cache: Array<Animal> = [];
const images: HTMLImgAttributes[] = [];

export const load: PageServerLoad = async () => {
  
  await pigs.load();

  return {
    data: pigs.data
  }
}

