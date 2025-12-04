<script>
	import '../app.css';
</script>

<div class="navbar bg-base-200 px-6">
	<div class="flex-1 text-xl font-bold"><a href="/">💊 Bhutan Antimicrobial Guidelines</a></div>
	<div class="flex gap-6">
		<a href="/" class="link">Home</a>
		<a href="/treatments" class="link">Treatment Recommendations</a>
		<a href="/about" class="link">About</a>
		<a href="/terms" class="link">Terms</a>
	</div>
</div>

<slot />

<div class="footer footer-center bg-base-200 p-6 mt-12">
	<div>
		<p>Bhutan Antimicrobial Guidelines. Currently in <b>PILOT</b></p>
		<span>
			Please provide feedback or report issues using this 
			<a href="https://forms.gle/Ks47wkzBgDkZpwcVA" class="link"><div class="btn btn-accent btn-xs">Feedback Form</div></a>
		</span>
	</div>
</div>