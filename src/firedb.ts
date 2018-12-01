import { Store, Module } from "vuex";
import log from "loglevel";
import { setDoc, removeDoc, setBusy } from "./mutations";
import { registerPath, unregisterPath } from "./actions";


const fireDBModule: Module<FireDBState, any> = {};
fireDBModule.namespaced = true;
fireDBModule.state = { isBusy: false, app: {} };
fireDBModule.mutations = { setDoc, removeDoc, setBusy };
fireDBModule.actions = { registerPath, unregisterPath };


export default function FireDBPlugin(store: Store<any>) {
  store.registerModule(["fireDB"], fireDBModule);
  log.info("fireDB module registered!");
}