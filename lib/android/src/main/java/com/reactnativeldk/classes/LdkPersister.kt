package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.*
import org.ldk.enums.ChannelMonitorUpdateErr
import org.ldk.structs.*
import org.ldk.structs.Persist.PersistInterface
import java.io.File

class LdkPersister {
    fun handleChannel(id: OutPoint, data: ChannelMonitor): Result_NoneChannelMonitorUpdateErrZ {
        val body = Arguments.createMap()
        body.putHexString("channel_id", id.to_channel_id())
        body.putHexString("counterparty_node_id", data._counterparty_node_id)

        try {
            if (LdkModule.channelStoragePath == "") {
                throw Exception("Channel storage path not set")
            }

            var file = File(LdkModule.channelStoragePath + "/" + id.to_channel_id().hexEncodedString() + ".bin")

            var isNew = !file.exists()

            file.writeBytes(data.write())

            LdkEventEmitter.send(EventTypes.native_log, "Persisted channel (${id.to_channel_id().hexEncodedString()}) to disk")
            LdkEventEmitter.send(EventTypes.backup, "")

            if (isNew) {
                LdkEventEmitter.send(EventTypes.new_channel, body)
            }

            return Result_NoneChannelMonitorUpdateErrZ.ok();
        } catch (e: Exception) {
            LdkEventEmitter.send(EventTypes.emergency_force_close_channel, body)
            return Result_NoneChannelMonitorUpdateErrZ.err(ChannelMonitorUpdateErr.LDKChannelMonitorUpdateErr_PermanentFailure)
        }
    }

    var persister = Persist.new_impl(object : PersistInterface {
        override fun persist_new_channel(id: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId): Result_NoneChannelMonitorUpdateErrZ {
            return handleChannel(id, data)
        }

        override fun update_persisted_channel(id: OutPoint, update: ChannelMonitorUpdate?, data: ChannelMonitor, update_id: MonitorUpdateId): Result_NoneChannelMonitorUpdateErrZ {
            return handleChannel(id, data)
        }
    })
}