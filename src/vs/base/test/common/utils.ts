/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as assert from 'assert';
import { TPromise, PPromise, TValueCallback, TProgressCallback, ProgressCallback } from 'vs/base/common/winjs.base';
import * as errors from 'vs/base/common/errors';
import * as paths from 'vs/base/common/paths';
import URI from 'vs/base/common/uri';

export class DeferredTPromise<T> extends TPromise<T> {

	public canceled = false;

	private completeCallback: TValueCallback<T>;
	private errorCallback: (err: any) => void;
	private progressCallback: ProgressCallback;

	constructor() {
		super((c, e, p) => {
			this.completeCallback = c;
			this.errorCallback = e;
			this.progressCallback = p;
		}, () => this.oncancel());
	}

	public complete(value: T) {
		this.completeCallback(value);
	}

	public error(err: any) {
		this.errorCallback(err);
	}

	public progress(p: any) {
		this.progressCallback(p);
	}

	private oncancel(): void {
		this.canceled = true;
	}
}

export class DeferredPPromise<C, P> extends PPromise<C, P> {

	private completeCallback: TValueCallback<C>;
	private errorCallback: (err: any) => void;
	private progressCallback: TProgressCallback<P>;

	constructor(init: (complete: TValueCallback<C>, error: (err: any) => void, progress: TProgressCallback<P>) => void = (c, e, p) => { }, oncancel?: any) {
		super((c, e, p) => { this.completeCallback = c; this.errorCallback = e; this.progressCallback = p; }, oncancel ? oncancel : () => this.oncancel);
	}

	private oncancel(): void {
		this.errorCallback(errors.canceled());
	}

	public complete(c: C) {
		this.completeCallback(c);
	}

	public progress(p: P) {
		this.progressCallback(p);
	}

	public error(e: any) {
		this.errorCallback(e);
	}
}

export function onError(error: Error, done: () => void): void {
	assert.fail(error);
	done();
}

export function toResource(path) {
	return URI.file(paths.join('C:\\', new Buffer(this.test.fullTitle()).toString('base64'), path));
}
