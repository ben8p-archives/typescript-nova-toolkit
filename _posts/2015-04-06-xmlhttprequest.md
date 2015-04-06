
#XMLHTTPRequest
Reside in the package ```nova/core/xhr```  
Send a request to a web service and return a [Promise](#Promise).  
The promise is rejected if the request fail. Otherwise it is resolved with the content returned by the webservice.  
Content can be handled as normal text, json or xml.  
a ```query``` property can be passed to add query arguments :
{% highlight javascript %}
var promise = xhr.get({
	url: 'URL TO QUERY',
	handleAs: xhr.handleAs.JSON,
	query: {
		bar: 'baz'
	}
});
{% endhighlight %}
For posting data, a ```post``` property can be used:
{% highlight javascript %}
var promise = xhr.post({
	url: 'URL TO QUERY',
	handleAs: xhr.handleAs.JSON,
	post: {
		foo: 'bar'
	}
})
{% endhighlight %}
