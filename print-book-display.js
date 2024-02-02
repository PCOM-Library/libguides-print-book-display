// Use mutation observer to remake profiles as they are loaded to limit flashing
const booksObserver = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		for(added_node of mutation.addedNodes) {
			if(added_node.nodeType != 1)
				continue;
			if(!added_node.classList.contains('s-lg-book'))
				continue;
			processBook(added_node);
		}
	});
});

if(document.getElementById('s-lg-guide-main')) 
	booksObserver.observe(document.getElementById('s-lg-guide-main'), { subtree: true, childList: true });
	
function processBook(book) {
	// Check if the book icon exists
	if(!book.querySelector('a .s-lg-icon[src*="redbooks"]'))
		return;
	// find the link
	let link = book.querySelector('.s-lg-icon[src*="redbooks"]').closest('a');
	let li = link.closest('li');
	let ul = link.closest('.s-lg-icons');
	// create div for the catalog link
	let cat_div = htmlToElement('<div class="pcom-lg-book-catalog-link"></div>');
	cat_div.append(link);
	link.innerHTML = '<span class="fa fa-book" aria-hidden="true"></span>Print copies of this title may be available';
	link.setAttribute('aria-describedby', book.querySelector('.s-lg-book-title').id);
	link.removeAttribute('target');
	
	// clean up the icon list
	li.remove();
	if(ul.querySelector('ul').childElementCount == 0)
		ul.style.display = 'none';
		
	// place cat_div before description or at end
	let props = book.querySelector('.s-lg-book-props');
	if(props.querySelector('[id^="s-lg-book-desc"]')) 
		props.insertBefore(cat_div, props.querySelector('[id^="s-lg-book-desc"]'));
	else
		props.append(cat_div);
}

window.addEventListener('DOMContentLoaded', function(evt) {
	try {
		booksObserver.disconnect();
	} catch(e) {
		console.error('Attempted to disconnect non-existent booksObserver');
	}
});