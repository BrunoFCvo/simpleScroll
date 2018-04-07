function SimpleScroll(args) {
	
	if(!args.domElement) {
		console.error("An element must be provided to setup the scroll bar");
		return;
	}
	
	
	// ELEMENTS
	let wrapper = args.domElement;
	let content = wrapper.querySelector(".sscroll_content");
	
	let rail = document.createElement("div");
	rail.classList.add("sscroll_rail");
	
	let bar = document.createElement("div");
	bar.classList.add("sscroll_bar");
	
	rail.appendChild(bar);
	wrapper.appendChild(rail);
	
	
	// HEIGHTS AND POSITIONS
	let bTop = 0;
	let deltaBar = 0;
	let deltaContent = 0;
	let barVisible = false;
	
	
	// EVENT HANDLING
	wrapper.addEventListener("scroll", function(e) {
		bTop = deltaBar * (this.scrollTop / deltaContent);
		bar.style.top = bTop + "px";
	});
	
	if(document.documentMode || /Edge/.test(navigator.userAgent) || /MSIE/.test(navigator.userAgent)) {
		bar.addEventListener("pointerdown", start);
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", end);
	} else {
		bar.addEventListener("mousedown", start);
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", end);
		
		bar.addEventListener("touchstart", start);
		window.addEventListener("touchmove", move);
		window.addEventListener("touchend", end);	
	}
	
	let lastY = 0;
	let dragging = false;
	
	function start(e) {
		e.stopPropagation();
		e.preventDefault();
		
		let pageY = e.pageY || e.touches[0].pageY;
		
		dragging = true;
		lastY = pageY - bTop;
		return false;
	}
	
	function move(e) {
		if(!dragging) return;
		
		let pageY = e.pageY || e.touches[0].pageY;
		
		bTop = (pageY - lastY);
		bTop = Math.max(bTop, 0);
		bTop = Math.min(bTop, deltaBar);
		
		bar.style.top = bTop + "px";
		wrapper.scrollTop = deltaContent * (bTop / deltaBar);
		return false;
	}
	
	function end(e) {
		if(!dragging) return;
		
		dragging = false;
		return false;
	}
	
	
	// PUBLIC FUNCTIONS
	this.updateHeights = function() {
		let vHeight = wrapper.clientHeight;
		let tHeight = wrapper.scrollHeight;
		
		barVisible = tHeight > vHeight;
		if(barVisible) {
			rail.style.display = "";
			
			let bHeight = (vHeight / tHeight) * vHeight;
			bar.style.height = bHeight + "px";
			
			deltaBar = vHeight - bHeight;
			deltaContent = tHeight - vHeight;
			
			bTop = deltaBar * (wrapper.scrollTop / deltaContent);
			bar.style.top = bTop + "px";
			
			let gap = wrapper.offsetWidth - wrapper.clientWidth;
			wrapper.style.marginRight = -gap + "px";
		} else {
			rail.style.display = "none";
		}
		
	}
	
	
	// AUTO UPDATE HEIGHTS
	if(args.autoResize) {
		setInterval(this.updateHeights, args.autoResize);
	}
	
}
