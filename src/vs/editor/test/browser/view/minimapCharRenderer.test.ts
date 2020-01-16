/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { RGBA8 } from 'vs/editor/common/core/rgba';
import { Constants } from 'vs/editor/browser/viewParts/minimap/minimapCharSheet';
import { MinimapCharRendererFactory } from 'vs/editor/browser/viewParts/minimap/minimapCharRendererFactory';

suite('MinimapCharRenderer', () => {

	let sampleData: Uint8ClampedArray | null = null;

	suiteSetup(() => {
		sampleData = new Uint8ClampedArray(Constants.SAMPLED_CHAR_HEIGHT * Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT * Constants.CHAR_COUNT);
	});

	suiteTeardown(() => {
		sampleData = null;
	});

	setup(() => {
		for (let i = 0; i < sampleData!.length; i++) {
			sampleData![i] = 0;
		}
	});

	const sampleD = [
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x0D, 0xFF, 0xFF, 0xFF, 0xA3, 0xFF, 0xFF, 0xFF, 0xF3, 0xFF, 0xFF, 0xFF, 0xE5, 0xFF, 0xFF, 0xFF, 0x5E, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xA4, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF7, 0xFF, 0xFF, 0xFF, 0xFC, 0xFF, 0xFF, 0xFF, 0xF0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x10, 0xFF, 0xFF, 0xFF, 0xFB, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x94, 0xFF, 0xFF, 0xFF, 0x02, 0xFF, 0xFF, 0xFF, 0x6A, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x3B, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x22, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x03, 0xFF, 0xFF, 0xFF, 0xF0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x47, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD6, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x31, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xE7, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x0E, 0xFF, 0xFF, 0xFF, 0xF7, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x69, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x3D, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x9B, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF9, 0xFF, 0xFF, 0xFF, 0xB9, 0xFF, 0xFF, 0xFF, 0xF0, 0xFF, 0xFF, 0xFF, 0xF7, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x0E, 0xFF, 0xFF, 0xFF, 0xA7, 0xFF, 0xFF, 0xFF, 0xF5, 0xFF, 0xFF, 0xFF, 0xE8, 0xFF, 0xFF, 0xFF, 0x71, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	];

	function setSampleData(charCode: number, data: number[]) {
		const rowWidth = Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT * Constants.CHAR_COUNT;
		let chIndex = charCode - Constants.START_CH_CODE;

		let globalOutputOffset = chIndex * Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT;
		let inputOffset = 0;
		for (let i = 0; i < Constants.SAMPLED_CHAR_HEIGHT; i++) {
			let outputOffset = globalOutputOffset;
			for (let j = 0; j < Constants.SAMPLED_CHAR_WIDTH; j++) {
				for (let channel = 0; channel < Constants.RGBA_CHANNELS_CNT; channel++) {
					sampleData![outputOffset] = data[inputOffset];
					inputOffset++;
					outputOffset++;
				}
			}
			globalOutputOffset += rowWidth;
		}
	}

	function createFakeImageData(width: number, height: number): ImageData {
		return {
			width: width,
			height: height,
			data: new Uint8ClampedArray(width * height * Constants.RGBA_CHANNELS_CNT)
		};
	}

	test('letter d @ 2x', () => {
		setSampleData('d'.charCodeAt(0), sampleD);
		let renderer = MinimapCharRendererFactory.createFromSampleData(sampleData!, 2);

		let background = new RGBA8(0, 0, 0, 255);
		let color = new RGBA8(255, 255, 255, 255);
		let imageData = createFakeImageData(Constants.BASE_CHAR_WIDTH * 2, Constants.BASE_CHAR_HEIGHT * 2);
		// set the background color
		for (let i = 0, len = imageData.data.length / 4; i < len; i++) {
			imageData.data[4 * i + 0] = background.r;
			imageData.data[4 * i + 1] = background.g;
			imageData.data[4 * i + 2] = background.b;
			imageData.data[4 * i + 3] = 255;
		}
		renderer.renderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, background, 2, false);

		let actual: number[] = [];
		for (let i = 0; i < imageData.data.length; i++) {
			actual[i] = imageData.data[i];
		}

		assert.deepEqual(actual, [
			0x2E, 0x2E, 0x2E, 0xFF, 0xAD, 0xAD, 0xAD, 0xFF,
			0xC6, 0xC6, 0xC6, 0xFF, 0xC8, 0xC8, 0xC8, 0xFF,
			0xC1, 0xC1, 0xC1, 0xFF, 0xCC, 0xCC, 0xCC, 0xFF,
			0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF,
		]);
	});

	test('letter d @ 1x', () => {
		setSampleData('d'.charCodeAt(0), sampleD);
		let renderer = MinimapCharRendererFactory.createFromSampleData(sampleData!, 1);

		let background = new RGBA8(0, 0, 0, 255);
		let color = new RGBA8(255, 255, 255, 255);
		let imageData = createFakeImageData(Constants.BASE_CHAR_WIDTH, Constants.BASE_CHAR_HEIGHT);
		// set the background color
		for (let i = 0, len = imageData.data.length / 4; i < len; i++) {
			imageData.data[4 * i + 0] = background.r;
			imageData.data[4 * i + 1] = background.g;
			imageData.data[4 * i + 2] = background.b;
			imageData.data[4 * i + 3] = 255;
		}

		renderer.renderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, background, 1, false);

		let actual: number[] = [];
		for (let i = 0; i < imageData.data.length; i++) {
			actual[i] = imageData.data[i];
		}

		assert.deepEqual(actual, [
			0xCB, 0xCB, 0xCB, 0xFF,
			0x82, 0x82, 0x82, 0xFF,
		]);
	});

});
