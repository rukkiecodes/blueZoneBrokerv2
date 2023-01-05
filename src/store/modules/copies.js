import { db } from "@/plugins/firebase"
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"

const state = {
    allCopies: []
}

const getters = {
    allCopies: state => state.allCopies
}

const mutations = {
    setCopies(state, copies) {
        state.allCopies.push(copies)
    }
}

const actions = {
    getAllCoppies({ commit }) {
        this.state.copies.allCopies = []
        getDocs(query(collection(db, "copyTrades"), where('isDeleted', '==', false))).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                commit('setCopies', {
                    id: doc.id,
                    ...doc.data()
                })
            })
        })
    },

    async copyTrader({ commit, dispatch }, copy) {
        await updateDoc(doc(db, "users", localStorage.blueZoneToken), {
            copies: arrayUnion(copy)
        })

        this.state.snackbar.active = true
        this.state.snackbar.color = 'success'
        this.state.snackbar.text = 'Copied trader successfully'

        return dispatch('getProfile', 'getAllCoppies')
    }
}

export default { state, getters, mutations, actions }