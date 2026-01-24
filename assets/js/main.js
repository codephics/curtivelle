/***************************************************
==================== JS INDEX ======================
****************************************************
01. PreLoader Js
02. Mobile Menu Js
03. Common Js
04. Menu Controls JS
05. Offcanvas Js
06. Search Js
07. cartmini Js
08. filter
09. Body overlay Js
10. Sticky Header Js
11. Theme Settings Js
12. Nice Select Js
13. Smooth Scroll Js
14. Slider Activation Area Start
15. Masonary Js
16. Wow Js
17. Counter Js
18. InHover Active Js
19. Line Animation Js
20. Video Play Js
21. Password Toggle Js
****************************************************/

(function ($) {
	"use strict";

	var windowOn = $(window);
	////////////////////////////////////////////////////

	// 01. PreLoader Js
	windowOn.on('load', function () {
		$("#loading").fadeOut(500);
	});

	// 08. Nice Select Js
	$('select').niceSelect();

	///////////////////////////////////////////////////
	// 07. Sticky Header Js
	windowOn.on('scroll', function () {
		var scroll = windowOn.scrollTop();
		if (scroll < 400) {
			$("#header-sticky").removeClass("header-sticky");
		} else {
			$("#header-sticky").addClass("header-sticky");
		}
	});

	////////////////////////////////////////////////////
	// 03. Search Js
	$(".search-open-btn").on("click", function () {
		$(".search__popup").addClass("search-opened");
	});
		
	$(".search-close-btn").on("click", function () {
		$(".search__popup").removeClass("search-opened");
	});
  

	$('.tp-service-item').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.tp-service-item').removeClass('active');
	});

	$('.tp-service-2-item').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.tp-service-2-item').removeClass('active');
	});

	$('.tp-project-3-item').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.tp-project-3-item').removeClass('active');
	});

	$('.tp-project-4-item').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.tp-project-4-item').removeClass('active');
	});

	$('.tp-feature-item').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.tp-feature-item').removeClass('active');
	});

	$('.tp-custom-accordion .accordion-items').on("click", function(){
		$(this).addClass('tp-faq-active').siblings().removeClass('tp-faq-active');
	});  

	// for header
	if ($("#tp-header-top__value-toogle").length > 0) {
		window.addEventListener('click', function(e){
		
			if (document.getElementById('tp-header-top__value-toogle').contains(e.target)){
				$(".tp-header-top__value-submenu").toggleClass("open");
			}
			else{
				$(".tp-header-top__value-submenu").removeClass("open");
			}
		});
	}

	// for header
	if ($("#tp-header-top__lang-toogle").length > 0) {
		window.addEventListener('click', function(e){
		
			if (document.getElementById('tp-header-top__lang-toogle').contains(e.target)){
				$(".tp-header-top__lang-submenu").toggleClass("open");
			}
			else{
				$(".tp-header-top__lang-submenu").removeClass("open");
			}
		});
	}

	///////////////////////////////////////////////////
	// 02. SubMenu Dropdown Toggle
	var header_icon = 
	`<span class="header-icon">
		<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M6.04088 0L0.535156 4.125V11H4.26484V8.59381C4.26484 7.64165 5.05698 6.87506 6.04088 6.87506C7.02477 6.87506 7.81692 7.64165 7.81692 8.59381V11H11.5466V4.125L6.04088 0Z" fill="#FFB302"/></svg>                                
	</span>`;
    $(header_icon).insertBefore('.menu-icon nav ul .menu-icon-2');


	////////////////////////////////////////////////////
	// 03. Common Js
	$("[data-background").each(function () {
		$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
	});

	$("[data-width]").each(function () {
		$(this).css("width", $(this).attr("data-width"));
	});

	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});

	$("[data-text-color]").each(function () {
		$(this).css("color", $(this).attr("data-text-color"));
	});

	$(".has-img").each(function () {
		var imgSrc = $(this).attr("data-menu-img");
		var img = `<img class="mega-menu-img" src="${imgSrc}" alt="img">`;
		$(this).append(img);

	});

	////////////////////////////////////////////////////
	// 12. Nice Select Js
	$('.tp-header-search-category select').niceSelect();

	////////////////////////////////////////////////////
	// 13. Smooth Scroll Js
	function smoothSctoll() {
		$('.smooth a').on('click', function (event) {
			var target = $(this.getAttribute('href'));
			if (target.length) {
				event.preventDefault();
				$('html, body').stop().animate({
					scrollTop: target.offset().top - 120
				}, 1500);
			}
		});
	}
	smoothSctoll();

	function back_to_top() {
		var btn = $('#back_to_top');
		var btn_wrapper = $('.back-to-top-wrapper');

		windowOn.scroll(function () {
			if (windowOn.scrollTop() > 300) {
				btn_wrapper.addClass('back-to-top-btn-show');
			} else {
				btn_wrapper.removeClass('back-to-top-btn-show');
			}
		});

		btn.on('click', function (e) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, '300');
		});
	}
	back_to_top();


	// 13. Swiper Js
	const galleryswiper = new Swiper('.tp-gallery-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 3,
		autoplay: true,
		spaceBetween: 5,
		centeredSlides: true,
		breakpoints: {
			'1600': {
				slidesPerView:3,
			},
			'1400': {
				slidesPerView:3,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},

	});
	// 13. Swiper Js
	const product2swiper = new Swiper('.tp-product-2-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 4,
		autoplay: false,
		spaceBetween: 30,
		breakpoints: {
			'1600': {
				slidesPerView:4,
			},
			'1400': {
				slidesPerView:4,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.price-next',
			prevEl: '.price-prev',
		},

	});
	// 13. Swiper Js
	const team2swiper = new Swiper('.tp-team-active-2', {
		// Optional parameters
		speed:1500,
		loop: true,
		slidesPerView: 3,
		autoplay: true,
		spaceBetween: 30,
		breakpoints: {
			'1600': {
				slidesPerView:3,
			},
			'1400': {
				slidesPerView:3,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},

	});
	// 13. Swiper Js
	const teamswiper = new Swiper('.tp-team-active', {
		// Optional parameters
		speed:1500,
		loop: true,
		slidesPerView: 3,
		autoplay: true,
		spaceBetween: 70,
		breakpoints: {
			'1600': {
				slidesPerView:3,
			},
			'1400': {
				slidesPerView:3,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
				spaceBetween: 30,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},

	});
	// 13. Swiper Js
	const project5swiper = new Swiper('.tp-project-5-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 5,
		autoplay: false,
		spaceBetween: 30,
		centeredSlides: true,
		breakpoints: {
			'1600': {
				slidesPerView:5,
			},
			'1400': {
				slidesPerView:4,
			},
			'1200': {
				slidesPerView:4,
				spaceBetween: 15,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		pagination: {
			el: ".tp-project-dots",
			clickable:true,
		},

	});
	// 13. Swiper Js
	const project2swiper = new Swiper('.tp-project-2-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 3,
		autoplay: true,
		spaceBetween: 30,
		centeredSlides: true,
		breakpoints: {
			'1600': {
				slidesPerView:3,
			},
			'1400': {
				slidesPerView:3,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		pagination: {
			el: ".tp-project-dots",
			clickable:true,
		},

	});
	// 13. Swiper Js
	const brandswiper = new Swiper('.tp-brand-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 6,
		autoplay: true,
		spaceBetween: 30,
		breakpoints: {
			'1600': {
				slidesPerView:6,
			},
			'1400': {
				slidesPerView:6,
			},
			'1200': {
				slidesPerView:5,
			},
			'992': {
				slidesPerView: 4,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},

	});
	// 13. Swiper Js
	const blog3swiper = new Swiper('.tp-blog-3-ative', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 3,
		autoplay: false,
		spaceBetween: 40,
		breakpoints: {
			'1600': {
				slidesPerView:3,
			},
			'1400': {
				slidesPerView:3,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.blog-prev',
			prevEl: '.blog-next',
		},

	});
	// 13. Swiper Js
	const blog2swiper = new Swiper('.tp-blog-2-ative', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 3,
		autoplay: false,
		spaceBetween: 40,
		breakpoints: {
			'1600': {
				slidesPerView:3,
			},
			'1400': {
				slidesPerView:3,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.blog-prev',
			prevEl: '.blog-next',
		},

	});
	// 13. Swiper Js
	const postboxswiper = new Swiper('.postbox__thumb-slider-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 1,
		autoplay: true,
		spaceBetween: 0,
		effect:'fade',
		breakpoints: {
			'1600': {
				slidesPerView:1,
			},
			'1400': {
				slidesPerView:1,
			},
			'1200': {
				slidesPerView:1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.postbox-arrow-next',
			prevEl: '.postbox-arrow-prev',
		},

	});
	// 13. Swiper Js
	const blogswiper = new Swiper('.tp-blog-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 2,
		autoplay: false,
		spaceBetween: 40,
		breakpoints: {
			'1600': {
				slidesPerView:2,
			},
			'1400': {
				slidesPerView:2,
			},
			'1200': {
				slidesPerView:2,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.blog-next',
			prevEl: '.blog-prev',
		},

	});
	// 13. Swiper Js
	const productswiper = new Swiper('.tp-product-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 3,
		autoplay: true,
		spaceBetween: 40,
		breakpoints: {
			'1600': {
				slidesPerView:3,
			},
			'1400': {
				slidesPerView:3,
			},
			'1200': {
				slidesPerView:3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},

	});
	// 13. Swiper Js
	const teatimonialswiper = new Swiper('.tp-testimonial-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 2,
		autoplay: true,
		spaceBetween: 30,
		breakpoints: {
			'1600': {
				slidesPerView:2,
			},
			'1400': {
				slidesPerView:2,
			},
			'1200': {
				slidesPerView:2,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},

	});
	// 13. Swiper Js
	const teatimonial2swiper = new Swiper('.tp-testimonial-2-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 1,
		autoplay: true,
		spaceBetween: 30,
		breakpoints: {
			'1600': {
				slidesPerView:1,
			},
			'1400': {
				slidesPerView:1,
			},
			'1200': {
				slidesPerView:1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.testimonial-next',
			prevEl: '.testimonial-prev',
		},

	});
	// 13. Swiper Js
	const teatimonial3swiper = new Swiper('.tp-testimonial-3-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 2,
		autoplay: true,
		spaceBetween: 40,
		breakpoints: {
			'1600': {
				slidesPerView:2,
			},
			'1400': {
				slidesPerView:2,
			},
			'1200': {
				slidesPerView:2,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.testimonial-next',
			prevEl: '.testimonial-prev',
		},

	});
	// 13. Swiper Js
	const slider3swiper = new Swiper('.tp-slider-3-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 1,
		autoplay: true,
		spaceBetween: 0,
		effect:'fade',
		breakpoints: {
			'1600': {
				slidesPerView:1,
			},
			'1400': {
				slidesPerView:1,
			},
			'1200': {
				slidesPerView:1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},
		pagination: {
			el: ".tp-slider-dots",
			clickable:true,
		},


	});
	// 13. Swiper Js
	const slider2swiper = new Swiper('.tp-slider-2-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 2,
		autoplay: true,
		spaceBetween: 30,
		breakpoints: {
			'1600': {
				slidesPerView:2,
			},
			'1400': {
				slidesPerView:2,
			},
			'1200': {
				slidesPerView:1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 2,
				spaceBetween: 10,
			},
			'576': {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},


	});
	// 13. Swiper Js
	const sliderswiper = new Swiper('.tp-slider-active', {
		// Optional parameters
		speed:1000,
		loop: true,
		slidesPerView: 1,
		autoplay: true,
		effect:'fade',
		breakpoints: {
			'1600': {
				slidesPerView:1,
			},
			'1400': {
				slidesPerView:1,
			},
			'1200': {
				slidesPerView:1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},

			a11y: false,
		},


	});

	////////////////////////////////////////////////////
	// 15. Masonary Js
	$('.grid').imagesLoaded(function () {

		var $grid = $('.grid').isotope({
			itemSelector: '.grid-item',
			percentPosition: true,
			masonry: {
				// use outer width of grid-sizer for columnWidth
				columnWidth: '',		
			}
		});


		// filter items on button click
		$('.masonary-menu').on('click', 'button', function () {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
		});

		//for menu active class
		$('.masonary-menu button').on('click', function (event) {
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			event.preventDefault();
		});

	});
	
	////////////////////////////////////////////////////
	// 15. Masonary Js
	$('.grid-2').imagesLoaded(function () {
		// init Isotope
		var $grid = $('.grid-2').isotope({
			itemSelector: '.grid-item-2',
			percentPosition: true,
			masonry: {
				// use outer width of grid-sizer for columnWidth
				columnWidth: '.grid-sizer',				
			}
		});


		// filter items on button click
		$('.masonary-menu').on('click', 'button', function () {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
		});

		//for menu active class
		$('.masonary-menu button').on('click', function (event) {
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			event.preventDefault();
		});

	});

	/* magnificPopup img view */
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});

	/* magnificPopup video view */
	$(".popup-video").magnificPopup({
		type: "iframe",
	});


	if ($('.scene').length > 0) {
		$('.scene').parallax({
			scalarX: 5.0,
			scalarY: 5.0,
		});
	};

	////////////////////////////////////////////////////
	// 16. Wow Js
	new WOW().init();

	function tp_ecommerce() {
		$('.tp-cart-minus').on('click', function () {
			var $input = $(this).parent().find('input');
			var count = Number($input.val()) - 1;
			count = count < 1 ? 1 : count;
			$input.val(count);
			$input.change();
			return false;
		});
	
		$('.tp-cart-plus').on('click', function () {
			var $input = $(this).parent().find('input');
			$input.val(Number($input.val()) + 1);
			$input.change();
			return false;
		});

		$("#slider-range").slider({
			range: true,
			min: 0,
			max: 500,
			values: [75, 300],
			slide: function (event, ui) {
				$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
			}
		});
		$("#amount").val("$" + $("#slider-range").slider("values", 0) +
			" - $" + $("#slider-range").slider("values", 1));
	
		

		$('.tp-checkout-payment-item label').on('click', function () {
			$(this).siblings('.tp-checkout-payment-desc').slideToggle(400);
			
		});
		

		$('.tp-color-variation-btn').on('click', function () {
			$(this).addClass('active').siblings().removeClass('active');
		});
		

		$('.tp-size-variation-btn').on('click', function () {
			$(this).addClass('active').siblings().removeClass('active');
		});
	
		////////////////////////////////////////////////////
		// 17. Show Login Toggle Js
		$('.tp-checkout-login-form-reveal-btn').on('click', function () {
			$('#tpReturnCustomerLoginForm').slideToggle(400);
		});
	
		////////////////////////////////////////////////////
		// 18. Show Coupon Toggle Js
		$('.tp-checkout-coupon-form-reveal-btn').on('click', function () {
			$('#tpCheckoutCouponForm').slideToggle(400);
		});
	
		////////////////////////////////////////////////////
		// 19. Create An Account Toggle Js
		$('#cbox').on('click', function () {
			$('#cbox_info').slideToggle(900);
		});
	
		////////////////////////////////////////////////////
		// 20. Shipping Box Toggle Js
		$('#ship-box').on('click', function () {
			$('#ship-box-info').slideToggle(1000);
		});
	}
	tp_ecommerce();

	////////////////////////////////////////////////////
	// 17. Counter Js
	new PureCounter();
	new PureCounter({
		filesizing: true,
		selector: ".filesizecount",
		pulse: 2,
	});

	////////////////////////////////////////////////////
	// 18. InHover Active Js
	$('.hover__active').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.hover__active').removeClass('active');
	});

	$('.activebsba').on("click", function () {
		$('#services-item-thumb').removeClass().addClass($(this).attr('rel'));
		$(this).addClass('active').siblings().removeClass('active');
	});



	////////////////////////////////////////////////////
	// 19. Line Animation Js
	if ($('#marker').length > 0) {
		function tp_tab_line(){
			var marker = document.querySelector('#marker');
			var item = document.querySelectorAll('.menu-style-3  > nav > ul > li');
			var itemActive = document.querySelector('.menu-style-3  > nav > ul > li.active');

			function indicator(e){
				marker.style.left = e.offsetLeft+"px";
				marker.style.width = e.offsetWidth+"px";
			}
				
		
			item.forEach(link => {
				link.addEventListener('mouseenter', (e)=>{
					indicator(e.target);
				});
				
			});

			
			var activeNav = $('.menu-style-3 > nav > ul > li.active');
			var activewidth = $(activeNav).width();
			var activePadLeft = parseFloat($(activeNav).css('padding-left'));
			var activePadRight = parseFloat($(activeNav).css('padding-right'));
			var totalWidth = activewidth + activePadLeft + activePadRight;
			
			var precedingAnchorWidth = anchorWidthCounter();
		
		
			$(marker).css('display','block');
			
			$(marker).css('width', totalWidth);
		
			function anchorWidthCounter() {
				var anchorWidths = 0;
				var a;
				var aWidth;
				var aPadLeft;
				var aPadRight;
				var aTotalWidth;
				$('.menu-style-3 > nav > ul > li').each(function(index, elem) {
					var activeTest = $(elem).hasClass('active');
					marker.style.left = elem.offsetLeft+"px";
					if(activeTest) {
					// Break out of the each function.
					return false;
					}
			
					a = $(elem).find('li');
					aWidth = a.width();
					aPadLeft = parseFloat(a.css('padding-left'));
					aPadRight = parseFloat(a.css('padding-right'));
					aTotalWidth = aWidth + aPadLeft + aPadRight;
			
					anchorWidths = anchorWidths + aTotalWidth;
	
				});
		
				return anchorWidths;
			}
		}
		tp_tab_line();
	}


	if ($('#productTabMarker').length > 0) {
		function tp_tab_line_2(){
			var marker = document.querySelector('#productTabMarker');
			var item = document.querySelectorAll('.tp-product-tab button');
			var itemActive = document.querySelector('.tp-product-tab .nav-link.active');

			// rtl settings
			var tp_rtl = localStorage.getItem('tp_dir');
			let rtl_setting = tp_rtl == 'rtl' ? 'right' : 'left';

			function indicator(e){
				marker.style.left = e.offsetLeft+"px";
				marker.style.width = e.offsetWidth+"px";
			}
				
		
			item.forEach(link => {
				link.addEventListener('click', (e)=>{
					indicator(e.target);
				});
			});
			
			var activeNav = $('.nav-link.active');
			var activewidth = $(activeNav).width();
			var activePadLeft = parseFloat($(activeNav).css('padding-left'));
			var activePadRight = parseFloat($(activeNav).css('padding-right'));
			var totalWidth = activewidth + activePadLeft + activePadRight;
			
			var precedingAnchorWidth = anchorWidthCounter();
		
		
			$(marker).css('display','block');
			
			$(marker).css('width', totalWidth);
		
			function anchorWidthCounter() {
				var anchorWidths = 0;
				var a;
				var aWidth;
				var aPadLeft;
				var aPadRight;
				var aTotalWidth;
				$('.tp-product-tab button').each(function(index, elem) {
					var activeTest = $(elem).hasClass('active');
					marker.style.left = elem.offsetLeft+"px";
					if(activeTest) {
					// Break out of the each function.
					return false;
					}
			
					a = $(elem).find('button');
					aWidth = a.width();
					aPadLeft = parseFloat(a.css('padding-left'));
					aPadRight = parseFloat(a.css('padding-right'));
					aTotalWidth = aWidth + aPadLeft + aPadRight;
			
					anchorWidths = anchorWidths + aTotalWidth;
	
				});
		
				return anchorWidths;
			}
		}
		tp_tab_line_2();
	}

	////////////////////////////////////////////////////
	// 20. Video Play Js
	var play = false;
	$('.tp-video-toggle-btn').on('click', function(){

		if(play === false){
			$('.tp-slider-video').addClass('full-width');
			$(this).addClass('hide');
			play = true;

			$('.tp-slider-video').find('video').each(function() {
				$(this).get(0).play();
			});
		}else{
			$('.tp-slider-video').removeClass('full-width');
			$(this).removeClass('hide');
			play = false;
			$('.tp-slider-video').find('video').each(function() {
				$(this).get(0).pause();
			});
		}

	});

	////////////////////////////////////////////////////
	// 21. Password Toggle Js
	if($('#password-show-toggle').length > 0){
		var btn = document.getElementById('password-show-toggle');
		
		btn.addEventListener('click', function(e){
			
			var inputType = document.getElementById('tp_password');
			var openEye = document.getElementById('open-eye');
			var closeEye = document.getElementById('close-eye');
	
			if (inputType.type === "password") {
				inputType.type = "text";
				openEye.style.display = 'block';
				closeEye.style.display = 'none';
			 } else {
				inputType.type = "password";
				openEye.style.display = 'none';
				closeEye.style.display = 'block';
			 }
		});
	}

	if ($('.tp-header-height').length > 0) {
		var headerHeight = document.querySelector(".tp-header-height");      
		var setHeaderHeight = headerHeight.offsetHeight;	
		
		$(".tp-header-height").each(function () {
			$(this).css({
				'height' : setHeaderHeight + 'px'
			});
		});
	  }
	// Jquery Appear raidal
	if (typeof ($.fn.knob) != 'undefined') {
		$('.knob').each(function () {
		var $this = $(this),
		knobVal = $this.attr('data-rel');

		$this.knob({
		'draw': function () {
			$(this.i).val(this.cv + '%')
		}
		});

		$this.appear(function () {
		$({
			value: 0
		}).animate({
			value: knobVal
		}, {
			duration: 2000,
			easing: 'swing',
			step: function () {
			$this.val(Math.ceil(this.value)).trigger('change');
			}
		});
		}, {
		accX: 0,
		accY: -150,
		});
	});
	}

	$('.tp-main-menu-content ul li a').wrapInner('<span></span>')

	if($('.tp-main-menu-content').length && $('.tp-main-menu-mobile').length){
		let navContent = document.querySelector(".tp-main-menu-content").outerHTML;
		let mobileNavContainer = document.querySelector(".tp-main-menu-mobile");
		mobileNavContainer.innerHTML = navContent;
	
	
		let arrow = $(".tp-main-menu-mobile .has-dropdown > a");
	
		arrow.each(function () {
			let self = $(this);
			let arrowBtn = document.createElement("BUTTON");
			arrowBtn.classList.add("dropdown-toggle-btn");
			arrowBtn.innerHTML = "<i class='fal fa-angle-right'></i>";
	
			self.append(function () {
			  return arrowBtn;
			});
	
			self.find("button").on("click", function (e) {
			  e.preventDefault();
			  let self = $(this);
			  self.toggleClass("dropdown-opened");
			  self.parent().toggleClass("expanded");
			  self.parent().parent().addClass("dropdown-opened").siblings().removeClass("dropdown-opened");
			  self.parent().parent().children(".tp-submenu").slideToggle();
			});
	
		});
	}
	
	if($('.tp-main-menu-content').length && $('.tp-main-menu-mobile').length){
		let navContent = document.querySelector(".tp-main-menu-content").outerHTML;
		let mobileNavContainer = document.querySelector(".tp-main-menu-mobile");
		mobileNavContainer.innerHTML = navContent;
	
	
		let arrow = $(".tp-main-menu-mobile .has-dropdown-2 > a");
	
		arrow.each(function () {
			let self = $(this);
			let arrowBtn = document.createElement("BUTTON");
			arrowBtn.classList.add("dropdown-toggle-btn");
			arrowBtn.innerHTML = "<i class='fal fa-angle-right'></i>";
	
			self.append(function () {
			  return arrowBtn;
			});
	
			self.find("button").on("click", function (e) {
			  e.preventDefault();
			  let self = $(this);
			  self.toggleClass("dropdown-opened");
			  self.parent().toggleClass("expanded");
			  self.parent().parent().addClass("dropdown-opened").siblings().removeClass("dropdown-opened");
			  self.parent().parent().children(".tp-submenu").slideToggle();
			});
	
		});
	}


	////////////////////////////////////////////////////
	// 09. Sidebar Js
	$(".tp-menu-bar").on("click", function () {
		$(".tpoffcanvas").addClass("opened");
		$(".body-overlay").addClass("apply");
	});

	$(".close-btn, .body-overlay, .tp-main-menu-mobile .tp-onepage-menu li a  > *:not(button)").on("click", function () {
		$(".tpoffcanvas").removeClass("opened");
		$(".body-overlay").removeClass("apply");
	});


	
	$('.tp-feature-item').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.tp-feature-item').removeClass('active');
	});

	// jarallax
	if ($('.jarallax').length > 0) {
		$('.jarallax').jarallax({
			speed: 0.2,
			imgWidth: 1366,
			imgHeight: 768,
		});
		
	};

	///////////////////////////////////////////////////
	// 07. Sticky Header Js
	windowOn.on('scroll', function () {
		var scroll = windowOn.scrollTop();
		if (scroll < 400) {
			$("#header-sticky").removeClass("header-sticky");
		} else {
			$("#header-sticky").addClass("header-sticky");
		}
	});

	if ($('.tp-header-height').length > 0) {
		var headerHeight = document.querySelector(".tp-header-height");      
		var setHeaderHeight = headerHeight.offsetHeight;	
		
		$(".tp-header-height").each(function () {
			$(this).css({
				'height' : setHeaderHeight + 'px'
			});
		});
	}

    ////////////////////////////////////////////////////
	// 05. One Page Scroll Js
	function scrollNav() {
		$('.tp-onepage-menu li a').on('click', function () {
			$(".tp-onepage-menu li a.active").removeClass("active");
			$(this).addClass("active");

			$('html, body').stop().animate({
				scrollTop: $($(this).attr('href')).offset().top - 80
			}, 300);
			return false;
		});
	}
	scrollNav();

		
	////////////////////////////////////////////////////
	// 02. sticky header
	function tp_pinned_header(){
		var lastScrollTop = 0;

		windowOn.on('scroll',function() {
				var currentScrollTop = $(this).scrollTop();

				if(currentScrollTop > lastScrollTop) {
						$('.tp-int-menu').removeClass('tp-header-pinned');
				}else if($(this).scrollTop() <= 500){
					$('.tp-int-menu').removeClass('tp-header-pinned');
				}else {
						// Scrolling up, remove the class
						$('.tp-int-menu').addClass('tp-header-pinned');
				}
				lastScrollTop = currentScrollTop;
		});
	}
	tp_pinned_header();


	$('.img_box_2').each(function() {
		var imgBox = $(this)
		var images = $(this).children('img');
		
		var myAnimation = new hoverEffect({
			parent: imgBox[0],
			intensity: 3,
			angle:Math.PI / 8,
			image1: images[0].getAttribute('src'),
			image2: images[1].getAttribute('src'),
			displacementImage: imgBox[0].getAttribute('displacementImage')
		});
		
	});

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
	gsap.config({
		nullTargetWarn: false,
	});

	let smoother = ScrollSmoother.create({
		smooth: 1.35,
		effects: true,
		smoothTouch: true,
		normalizeScroll: false,
		ignoreMobileResize: true,
	});

	$(document).ready(function() {

		$('img').imagesLoaded()
		.done(function(instance) {
		  allImagesLoaded();
		})
		.fail(function(instance) {
		  
		  handleFailedImages(instance);
		});
  
	  
		function allImagesLoaded() {
			
			$('.tp-hover-distort-wrapper').each(function(){
				var $this = $(this)
				var canvas = $this.find('.canvas')
				
				if($this.find('img.front')){
					$this.css({
						"width" : $this.find('img.front').width(),
						"height" : $this.find('img.front').height(),
					})
				}
			
				var frontImage = $this.find('img.front').attr('src')
				var backImage = $this.find('img.back').attr('src')
				var displacementImage = $this.find('.tp-hover-distort').attr('data-displacementImage')
		
				var distortEffect = new hoverEffect({
					parent: canvas[0],
					intensity: 3,
					speedIn: 2,
					speedOut: 2,
					angle: Math.PI / 3,
					angle2: -Math.PI / 3,
					image1: frontImage,
					image2: backImage,
					displacementImage: displacementImage,
					imagesRatio: $this.find('.tp-hover-distort').height()/$this.find('.tp-hover-distort').width()
				});
		
			});
		}
	
		function handleFailedImages(instance) {
			console.error('One or more images failed to load.');
	
			var failedImages = instance.images.filter(function(img) {
			return !img.isLoaded;
			});
	
			failedImages.forEach(function(failedImage) {
			console.error('Failed image source:', failedImage.img.src);
			});
		}

		// split text animation
		var st = $(".tp-split-text");
        if(st.length == 0) return;
        gsap.registerPlugin(SplitText);
        st.each(function(index, el) {
            el.split = new SplitText(el, {
                type: "lines,words,chars",
                linesClass: "tp-split-line"
            });
            gsap.set(el, { perspective: 400 });

            if( $(el).hasClass('tp-split-in-right') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    x: "50",
                    ease: "Back.easeOut",
                });
            }
            if( $(el).hasClass('tp-split-in-left') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    x: "-50",
                    ease: "circ.out",
                });
            }
            if( $(el).hasClass('tp-split-in-up') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    y: "80",
                    ease: "circ.out",
                });
            }
            if( $(el).hasClass('tp-split-in-down') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    y: "-80",
                    ease: "circ.out",
                });
            }
            el.anim = gsap.to(el.split.chars, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                },
                x: "0",
                y: "0",
                rotateX: "0",
                scale: 1,
                opacity: 1,
                duration: 0.4,
                stagger: 0.02,
            });
        });
	});


	

})(jQuery);