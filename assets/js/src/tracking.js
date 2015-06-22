jQuery(document).ready(function($) {

	// eg "ref"
	var referral_variable = affwp_erl_vars.referral_variable;

	// cookie expiration
	var cookie_expiration = affwp_erl_vars.cookie_expiration;

	// get the cookie value
	var cookie = $.cookie( 'affwp_erl_id' );

	// get the value of the referral variable from the query string
	var ref = affiliatewp_erl_get_query_vars()[referral_variable];

	// if ref exists but cookie doesn't, set cookie with value of ref
	if ( ref && ! cookie ) {
		var cookie_value = ref;

		$.cookie( 'affwp_erl_id', cookie_value, { expires: parseInt( cookie_expiration ), path: '/' } );
	}
	
	// split up the query string and return the parts
	function affiliatewp_erl_get_query_vars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	// the affiliate ID will usually be the value of the cookie, but on first page load we'll grab it from the query string
	if ( cookie ) {
		affiliate_id = cookie;
	} else {
		affiliate_id = ref;
	}

	function updateQueryStringParameter( uri, ref_var, aff_id ) {

	  var re = new RegExp("([?|&])" + ref_var + "=.*?(&|#|$)", "i");

	  if ( uri.match(re) ) {
	    return uri.replace(re, '$1' + ref_var + "=" + aff_id + '$2');
	  } else {

	    var hash =  '';

	    // if URL already has query string, use ampersand
	    var separator = uri.indexOf( '?' ) !== -1 ? "&" : "?";    
	    
	    // if hash exists in URL, move it to the end
	    if ( uri.indexOf( '#' ) !== -1 ) {
	        hash = uri.replace( /.*#/, '#' );
	        uri = uri.replace( /#.*/, '' );
	    }

	    return uri + separator + ref_var + "=" + aff_id + hash;

	  }

	}

	if ( affiliate_id ) {
		var url = affwp_erl_vars.url;

		// get all the targeted URLs on the page that start with the specific URL
		var target_urls = $("a[href^='" + url + "']");

		// modify each target URL on the page
		$(target_urls).each( function() {
			
			// get the current href of the link
			current_url = $(this).attr('href');

			// build URL
			$(this).attr('href', updateQueryStringParameter( current_url, referral_variable, affiliate_id ) );
			
		});

	}
	
});