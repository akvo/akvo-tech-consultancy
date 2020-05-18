<script>
	import axios from "axios";
    import { onMount } from "svelte";
	import Nav from "./Nav.svelte";
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import Thumb from "./Thumb.svelte";
	let items = [];
	let loading = true;
    onMount(() => {
		axios.get("/api/test")
			.then(res => {items = res.data.projects})
			.finally(
				loading = false
			);
    });
</script>

<Nav />
<Header />
<div class="container">
<div class="card-deck mb-3 text-center">
{#each items as item}
	<Thumb data={item}/>
{/each}
</div>
<Footer />
</div>
