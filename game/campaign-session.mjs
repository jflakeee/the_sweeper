import {initial} from './core.mjs';
import {migrateV1,readCampaign,persistCampaign} from './campaign-save.mjs';

// All methods must run under the existing exclusive save-owner lock.
export function loadSession(storage){
 const loaded=readCampaign(storage);
 if(loaded.corrupt)return loaded;
 if(loaded.current)return {...loaded,saved:structuredClone(loaded.current)};
 const current=loaded.migration??migrateV1(initial());
 return {current,saved:null,fresh:!!loaded.fresh,migration:!!loaded.migration};
}
export function transactionCandidate(state,operation){
 const candidate=structuredClone(state);
 return operation(candidate)?candidate:null;
}
export function commitSession(storage,candidate,saved){
 const current=persistCampaign(storage,candidate,saved);
 return {current,saved:structuredClone(current)};
}
