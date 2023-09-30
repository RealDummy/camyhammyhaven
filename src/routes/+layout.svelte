<script>
	import '../app.postcss';
  	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Button, } from 'flowbite-svelte';
	import {ChevronDownSolid} from 'flowbite-svelte-icons';
</script>

<section>
	<Navbar let:hidden let:toggle navClass="absolute w-full z-20 top-0 left-0" color="blue">
		<NavBrand href="/">
			<img class="mr-3 h-20" src="logo.png" alt="logo">
			<span class="hidden lg:block">Camy & Hammy Haven</span>
		</NavBrand>
		<div class="flex md:order-2">
			<Button pill={true} color="alternative" size="lg">Donate</Button>
			<NavHamburger on:click={toggle} />
		</div>
		<NavUl {hidden} class="order-1">
			<NavLi class=" m-0 cursor-pointer">Home</NavLi>
			<NavLi class="cursor-pointer">Adopt
				<ChevronDownSolid class="w-3 h-3 ml-2 inline" />
			</NavLi>
			<Dropdown >
				<DropdownItem>Application</DropdownItem>
				<DropdownItem>Bonding</DropdownItem>
				<DropdownItem>FAQ</DropdownItem>
			</Dropdown>
			<NavLi class="cursor-pointer">Get Involved
				<ChevronDownSolid class="w-3 h-3 ml-2 inline" />
			</NavLi>
			<Dropdown>
				<DropdownItem>Foster</DropdownItem>
				<DropdownItem>Volunteer</DropdownItem>
				<DropdownItem>Socials</DropdownItem>
			</Dropdown>
			<NavLi class="cursor-pointer">Learn
				<ChevronDownSolid class="w-3 h-3 ml-2 inline" />
			</NavLi>
			<Dropdown>
				<DropdownItem>Guinea Pig Cages</DropdownItem>
				<DropdownItem>Guinea Pig Diet</DropdownItem>
				<DropdownItem>Guinea Pig Health</DropdownItem>
				<DropdownItem>Guinea Pig Chit Chat</DropdownItem>
				<DropdownItem>Hamsters</DropdownItem>
			</Dropdown>
		</NavUl>
	</Navbar>
	<div style="height: 150px;"></div>
</section>

<slot />
