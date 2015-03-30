/// <reference path="../../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import xhr = require('nova/core/xhr');

registerSuite(function () {
	return {
		name: 'nova/core/xhr',

		beforeEach: function () {
		},
		'toQuery': function() {
			assert.equal(xhr.toQuery(true), 'true');
			assert.equal(xhr.toQuery(false), 'false');
			assert.equal(xhr.toQuery(null), 'null');
			assert.equal(xhr.toQuery(undefined), undefined);
			assert.equal(xhr.toQuery(5), '5');
			assert.equal(xhr.toQuery('foo'), 'foo');
			assert.equal(xhr.toQuery('foo bar'), 'foo%20bar');
			assert.equal(xhr.toQuery([1,2,3]), '1%2C2%2C3');
			assert.equal(xhr.toQuery({
				foo: true,
				bar: 5,
				baz: null,
				empty: undefined,
				barbaz: {
					inside: 'bar baz'
				},
				foobar: ['one', 'two', 'three']
			}), 'foo=true&bar=5&baz=null&empty=&barbaz=%7B%22inside%22%3A%22bar%20baz%22%7D&foobar[]=one&foobar[]=two&foobar[]=three');

		},
		'xmlhttprequest': {
			'get json': function() {
				var dfd = this.async(1000);
				xhr.get({
					url: (<any>require).toUrl('./testResources/foo.json'),
					handleAs: xhr.handleAs.JSON,
					query: {
						bar: 'baz'
					}
				}).then(dfd.callback((e:xhr.JsonResponse) => {
					assert.isTrue(e.response.ok);
				}))

			},
			'get text': function() {
				var dfd = this.async(1000);
				xhr.get({
					url: (<any>require).toUrl('./testResources/foo.txt'),
					handleAs: xhr.handleAs.TEXT,
					query: 'baz=true'
				}).then(dfd.callback((e:xhr.TextResponse) => {
					assert.equal(e.response, 'foo\n');
				}))

			},
			'get xml': function() {
				var dfd = this.async(1000);
				xhr.get({
					url: (<any>require).toUrl('./testResources/foo.xml'),
					handleAs: xhr.handleAs.XML
				}).then(dfd.callback((e:xhr.XmlResponse) => {
					assert.equal(e.response.getElementsByTagName('foo')[0].textContent, 'true');
				}))

			},
			'post json': function() {
				var dfd = this.async(1000);
				xhr.post({
					url: (<any>require).toUrl('./testResources/foo.json'),
					handleAs: xhr.handleAs.JSON,
					query: {
						bar: 'baz'
					},
					post: {
						foo: 'bar'
					}
				}).then(dfd.callback((e:xhr.JsonResponse) => {
					assert.isTrue(e.response.ok);
				}))

			},
			'post text': function() {
				var dfd = this.async(1000);
				xhr.post({
					url: (<any>require).toUrl('./testResources/foo.txt'),
					handleAs: xhr.handleAs.TEXT,
					query: '?bar=true',
					post: '?baz=true'
				}).then(dfd.callback((e:xhr.TextResponse) => {
					assert.equal(e.response, 'foo\n');
				}))

			},
			'post xml': function() {
				var dfd = this.async(1000);
				xhr.post({
					url: (<any>require).toUrl('./testResources/foo.xml'),
					handleAs: xhr.handleAs.XML
				}).then(dfd.callback((e:xhr.XmlResponse) => {
					assert.equal(e.response.getElementsByTagName('foo')[0].textContent, 'true');
				}))

			},
			'put json': function() {
				var dfd = this.async(1000);
				xhr.put({
					url: (<any>require).toUrl('./testResources/foo.json'),
					handleAs: xhr.handleAs.JSON
				}).then(dfd.callback((e:xhr.JsonResponse) => {
					assert.isTrue(e.response.ok);
				}))

			},
			'put text': function() {
				var dfd = this.async(1000);
				xhr.put({
					url: (<any>require).toUrl('./testResources/foo.txt'),
					handleAs: xhr.handleAs.TEXT
				}).then(dfd.callback((e:xhr.TextResponse) => {
					assert.equal(e.response, 'foo\n');
				}))

			},
			'put xml': function() {
				var dfd = this.async(1000);
				xhr.put({
					url: (<any>require).toUrl('./testResources/foo.xml'),
					handleAs: xhr.handleAs.XML
				}).then(dfd.callback((e:xhr.XmlResponse) => {
					assert.equal(e.response.getElementsByTagName('foo')[0].textContent, 'true');
				}))

			},
			'del json': function() {
				var dfd = this.async(1000);
				xhr.del({
					url: (<any>require).toUrl('./testResources/foo.json'),
					handleAs: xhr.handleAs.JSON
				}).then(dfd.callback((e:xhr.JsonResponse) => {
					assert.isTrue(e.response.ok);
				}))

			},
			'del text': function() {
				var dfd = this.async(1000);
				xhr.del({
					url: (<any>require).toUrl('./testResources/foo.txt'),
					handleAs: xhr.handleAs.TEXT
				}).then(dfd.callback((e:xhr.TextResponse) => {
					assert.equal(e.response, 'foo\n');
				}))

			},
			'del xml': function() {
				var dfd = this.async(1000);
				xhr.del({
					url: (<any>require).toUrl('./testResources/foo.xml'),
					handleAs: xhr.handleAs.XML
				}).then(dfd.callback((e:xhr.XmlResponse) => {
					assert.equal(e.response.getElementsByTagName('foo')[0].textContent, 'true');
				}))

			}
		}
	}
})
