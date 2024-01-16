import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

import type { HTMLImgAttributes } from 'svelte/elements';

const PASSWORD = env.PASSWORD;
const USER = env.USERNAME;
const ACCOUNT = env.ACCOUNT;

interface Animal {
  id: number;
  name: string;
}



const DATA_INVALIDATION_TIME = 1000 * 60 * 2;

class AnimalCache {
  data: Animal[] = [];
  images: HTMLImgAttributes[] = [];
  last_fetch: number = 0;

  async load() {

    if(this.validateCache()) {
      return;
    }
    console.log("reloading cache!");
    this.data.splice(0, this.data.length);
    this.images.splice(0, this.images.length);

    let res = await fetch(`https://us06b.sheltermanager.com/service?method=json_adoptable_animals&username=${USER}&password=${PASSWORD}&account=${ACCOUNT}`);
    let json = await res.json();
    this.last_fetch = Date.now();

    for(let animal of json) {
      if( !this.filterAnimal(animal) ) {
        continue;
      }
      this.data.push(this.createAnimal(animal));
    }
    for(let animal of this.data) {
      this.images.push({
          src: `https://us06b.sheltermanager.com/service?method=animal_image&animalid=${animal.id}&account=${env.ACCOUNT}`,
          alt: animal.name,
          title: animal.name,
      });
    }
  }

  createAnimal(jsonObj: any): Animal {
    return {
      id: parseInt(jsonObj["ID"]),
      name: jsonObj["ANIMALNAME"],
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
      pigs: pigs.data,
      images: pigs.images,
  }
}

