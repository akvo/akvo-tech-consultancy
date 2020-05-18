<script>
export let data;
const handleClick = (x) => {
	console.log(x);
}; 

</script>
<div class="card mb-4 shadow-sm">
    <div class="card-header">
        <h4 class="my-0 font-weight-normal">{data.title}</h4>
    </div>
    <div class="card-body">
        <ul class="list-unstyled mt-3 mb-4">
            <li>{data.subtitle}</li>
            <li>Email support</li>
            <li>Help center access</li>
        </ul>
        <button class="btn btn-lg btn-block btn-outline-primary" on:click={() => {handleClick(data)}} >
			Generate
        </button>
    </div>
</div>
