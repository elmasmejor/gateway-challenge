<template>
  <div>
    <el-card class="box-card" v-if="gatewayId">
      <p style="font-size: var(--el-font-size-base)">Detail</p>
      <template #header>
        <div class="card-header">
          <span><strong>{{ gateway.name }}</strong></span>
          <el-button class="button" text @click="navigateTo('/gateway')">
            Gateway List
          </el-button>
        </div>
      </template>
      <el-descriptions
          direction="vertical"
          :column="4"
          border
          style="margin-bottom: 25px">
        <el-descriptions-item label="serial number">{{ gateway.serial_number }}</el-descriptions-item>
        <el-descriptions-item label="address">{{ gateway.ipv4 }}</el-descriptions-item>
      </el-descriptions>
      <p style="font-size: var(--el-font-size-base)">Devices
        <el-button class="button" style="margin-left: 5px" text @click="showAddDialog=true">Add New</el-button>
      </p>
      <el-table :data="devices" style="width: 100%">
        <el-table-column prop="uid" label="uid" width="50"/>
        <el-table-column prop="status" label="status" width="120">
          <template #default="slot">
            <el-switch
                v-model="slot.row.status"
                class="mt-2"
                style="margin-left: 24px"
                inline-prompt
                disabled
            />
          </template>
        </el-table-column>
        <el-table-column prop="vendor" label="vendor" width="120"/>
        <el-table-column fixed="right" label="actions" width="120">
          <template #default="slot">
            <el-button link type="primary" size="small" @click="edit(slot.row)">edit</el-button>
            <el-button link type="primary" size="small" @click="remove(slot.row)">delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showAddDialog" :title="`${dialogTitle} Device`">
      <el-form :model="newDevice">
        <el-form-item label="uid:" label-width="140px">
          <el-input-number v-model="newDevice.uid" :min="1"/>
        </el-form-item>

        <el-form-item label="status:" label-width="140px">
          <el-switch
              v-model="newDevice.status"
              class="mb-2"
              active-text="online"
              inactive-text="offline"
              style="--el-switch-on-color: #13ce66;"
          />
        </el-form-item>

        <el-form-item label="vendor:" label-width="140px">
          <el-input v-model="newDevice.vendor" autocomplete="off"/>
        </el-form-item>

      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addOrEdit">Accept</el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useRoute} from "vue-router";

export default {
  name: "detail",
  mounted() {
    this.getGatewayDetails();
  },
  created() {
    const route = useRoute();
    this.gatewayId = route.params.id;
  },
  data() {
    return {
      loading: true,
      gatewayId: null,
      gateway: {},
      devices: [],
      showAddDialog: false,
      dialogTitle: 'New',
      newDevice: {
        uid: '',
        status: false,
        vendor: '',
      },
      editDevice: false,
      deviceForEdit: '',
    }
  },
  methods: {
    getGatewayDetails() {
      this.loading = true;
      $fetch(`/gateway/${this.gatewayId}`).then((res) => {
        this.gateway = res.gateway;
        this.devices = res.devices;
        this.loading = false;
      });
    },
    addOrEdit() {
      const uri = this.editDevice
          ? `/gateway/${this.gatewayId}/device/${this.deviceForEdit}`
          : `/gateway/${this.gatewayId}/device`;
      const method = this.editDevice ? "PATCH" : "POST";
      const message = this.editDevice ? "device edited" : "device registered";
      $fetch(uri, {
        method: method,
        body: this.newDevice
      }).then((res) => {
        if (this.editDevice) {
          const index = this.devices.findIndex((d) => d._id === res._id);
          if (index >= 0) {
            this.devices[index] = res;
          }
        } else {
          this.devices.push(res);
        }
        this.cleanEntity();
        this.showAddDialog = false;
        this.editDevice = false;
        this.showNotification('Info', message)
      });
    },
    edit(data) {
      this.dialogTitle = 'Edit';
      this.editDevice = true;
      this.newDevice.status = data.status;
      this.newDevice.vendor = data.vendor;
      this.newDevice.uid = data.uid;
      this.deviceForEdit = data._id;
      this.showAddDialog = true;
    },
    remove(data) {
      ElMessageBox.confirm(
          'this action will delete this devices, Are you sure you want to continue with this?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
      )
          .then(() => {
            this.deleteDevice(data._id);
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: 'Delete canceled',
            })
          })
    },
    deleteDevice(id) {
      $fetch(`/gateway/${this.gatewayId}/device/${id}`, {
        method: "DELETE"
      }).then((res) => {
        this.devices = this.devices.filter((d) => d._id !== res._id)
        this.dialogTitle = false;
        this.showNotification('Info', 'this device have been removed')
      });
    },
    showNotification(title, message, error = false) {
      ElNotification({
        title: title || 'title',
        message: message || 'info message',
        type: error ? 'error' : 'success',
      })
    },
    cleanEntity() {
      this.dialogTitle = 'New';
      this.editDevice = false;
      this.newDevice.status = false;
      this.newDevice.vendor = '';
      this.newDevice.uid = '';
    },
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 500px;
}
</style>