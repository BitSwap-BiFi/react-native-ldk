import { DefaultLdkDataShape } from './types';

/**
 * Convert string to bytes
 * @param str
 * @returns {Uint8Array}
 */
export const stringToBytes = (str: string): Uint8Array => {
	return Uint8Array.from(str, (x) => x.charCodeAt(0));
};

/**
 * Converts bytes to readable string
 * @returns {string}
 * @param bytes
 */
export const bytesToString = (bytes: Uint8Array): string => {
	const arr: number[] = [];
	bytes.forEach((n) => arr.push(n));
	return String.fromCharCode.apply(String, arr);
};

/**
 * Converts bytes to hex string
 * @param bytes
 * @returns {string}
 */
// export const bytesToHexString = (bytes: Uint8Array): string => {
// 	return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
// };

/**
 * Converts hex string to bytes
 * @param hexString
 * @returns {Uint8Array}
 */
export const hexStringToBytes = (hexString: string): Uint8Array => {
	return new Uint8Array(
		(hexString.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)),
	);
};

/**
 * Split '_' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @param  {string} split     The split char that concats the value
 * @return {string}           The words conected with the separator
 */
export const toCaps = (
	value: string = '',
	separator: string = ' ',
	split: string = '-',
): string => {
	return value
		.split(split)
		.map((v) => v.charAt(0).toUpperCase() + v.substring(1))
		.reduce((a, b) => `${a}${separator}${b}`);
};

const chars =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const btoa = (input: string): string => {
	let str = input;
	let output = '';

	for (
		let block = 0, charCode, i = 0, map = chars;
		str.charAt(i | 0) || ((map = '='), i % 1);
		output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
	) {
		charCode = str.charCodeAt((i += 3 / 4));

		if (charCode > 0xff) {
			throw new Error(
				"'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
			);
		}

		block = (block << 8) | charCode;
	}

	return output;
};

export const getDefaultLdkStorageShape = (seed: string) => {
	return {
		[seed]: DefaultLdkDataShape,
	};
};
