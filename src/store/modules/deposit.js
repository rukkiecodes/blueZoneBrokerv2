import { db } from "@/plugins/firebase"
import { uuid } from 'vue-uuid'
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

const state = {
    dialog: false,
    address: "0xe58ad656244e17c5f51c91834276f1774671a2c7",
    copyText: "Copy",
    currency: 'Bitcoin',
    amount: 0,
    loading: false,
}

const actions = {
    async depositFund({ commit, dispatch }) {
        if (state.amount <= 0 || state.currency == '' || state.address == '') return

        this.state.deposit.dialog = false
        this.state.deposit.loading = true
        let sharedId = uuid.v4()
        
        await addDoc(collection(db, "users", localStorage.blueZoneToken, 'deposits'), {
            sharedId,
            currency: state.currency,
            amount: state.amount,
            address: state.address,
            user: localStorage.blueZoneToken,
            state: 'pending',
            timestamp: serverTimestamp()
        })
        await addDoc(collection(db, "users", localStorage.blueZoneToken, 'transactions'), {
            sharedId,
            currency: state.currency,
            amount: state.amount,
            address: state.address,
            user: localStorage.blueZoneToken,
            state: 'pending',
            type: 'deposit',
            timestamp: serverTimestamp()
        })
        this.state.deposit.loading = false
        this.state.snackbar.snackbar.active = true
        this.state.snackbar.snackbar.text = 'Deposit request sent'
        this.state.snackbar.snackbar.bg = 'green'
        return dispatch('getTransactions')
    }
}

export default { actions, state }