<script>
	import '../app.postcss';
  	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Button, } from 'flowbite-svelte';
	import {ChevronDownSolid} from 'flowbite-svelte-icons';
</script>

<section>
	<Navbar let:hidden let:toggle navClass="absolute w-full z-20 top-0 left-0 bg-primary drop-shadow">
		<NavBrand href="/">
			<img class="mr-3 h-20" src="logo.png" alt="logo">
			<span class="hidden lg:block">Camy & Hammy Haven</span>
		</NavBrand>
		<div class="flex md:order-2">
			<Button pill={true} class="bg-accent text-black" size="lg">Donate</Button>
			<NavHamburger on:click={toggle} />
		</div>
		<NavUl {hidden} class="order-1">
			<NavLi class=" m-0 cursor-pointer"><a href="/" class="text-lg">Home</a></NavLi>
			<NavLi class="cursor-pointer"><span class="text-lg">Adopt</span>
				<ChevronDownSolid class="w-3 h-3 ml-2 inline" />
			</NavLi>
			<Dropdown class="bg-primary-light rounded-lg">
				<DropdownItem href="/application">Application</DropdownItem>
				<DropdownItem href="/bonding">Bonding</DropdownItem>
				<DropdownItem href="/faq">FAQ</DropdownItem>
			</Dropdown>
			<NavLi class="cursor-pointer"><span class="text-lg">Involved</span>
				<ChevronDownSolid class="w-3 h-3 ml-2 inline" />
			</NavLi>
			<Dropdown class="bg-primary-light rounded-lg">
				<DropdownItem>Foster</DropdownItem>
				<DropdownItem>Volunteer</DropdownItem>
				<DropdownItem>Socials</DropdownItem>
			</Dropdown>
			<NavLi class="cursor-pointer"><span class="text-lg">Learn</span> 
				<ChevronDownSolid class="w-3 h-3 ml-2 inline" />
			</NavLi>
			<Dropdown class="bg-primary-light rounded-lg">
				<DropdownItem>Guinea Pig Cages</DropdownItem>
				<DropdownItem>Guinea Pig Diet</DropdownItem>
				<DropdownItem>Guinea Pig Health</DropdownItem>
				<DropdownItem>Guinea Pig Chit Chat</DropdownItem>
				<DropdownItem>Hamsters</DropdownItem>
			</Dropdown>
		</NavUl>
	</Navbar>
	<div style="height: 80px;"></div>
</section>

<slot />
