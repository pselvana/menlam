<script>
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col">

	<div class="navbar bg-base-200 px-6">
		<div class="flex-1 text-xl font-bold"><a href="/">💊 Bhutan Infectious Disease Guidelines</a></div>
		<div class="flex gap-6">
			<a href="/treatments" class="link">Treatment Recommendations</a>
			<a href="/about" class="link">About</a>
			<a href="/terms" class="link">Terms</a>
			<div class="btn btn-primary btn-xs">Feedback Form</div>
		</div>
	</div>

	<!-- Main content expands -->
	<div class="flex-1">
		<slot />
	</div>

	<!-- Footer pushed to bottom -->
	<div class="footer footer-center bg-base-200 p-2 mt-auto">
		<div>
			<span>
				<div class="flex items-center justify-center gap-2 px-3 rounded-full bg-warning text-warning-content font-bold shadow">
				<span class="text-lg">⚠️</span>
				Pilot
				</div>
			</span>
			
		</div>
	</div>

</div>
