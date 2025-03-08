import {  makeJsonDecoder } from '@urlpack/json';
const decoder = makeJsonDecoder();


export default function decryptUrlPayload(json){
    return decoder.decode(json)
}