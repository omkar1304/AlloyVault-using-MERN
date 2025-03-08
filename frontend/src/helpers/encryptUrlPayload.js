import { makeJsonEncoder } from '@urlpack/json';
const encoder = makeJsonEncoder();


export default function encodeUrlPayload(json){
    return "?payload="+encoder.encode(json)
}