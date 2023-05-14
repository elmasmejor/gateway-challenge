<template>
  <h1>Gateways</h1>
  <el-button class="button" text @click="addNew">Add New</el-button>

  <el-table :data="gateways" style="width: 100%" v-loading="loading">
    <el-table-column fixed prop="name" label="Name" width="150"/>
    <el-table-column prop="serial_number" label="Serial Number" width="150"/>
    <el-table-column prop="ipv4" label="ipv4" width="150"/>

    <el-table-column fixed="right" label="Operations" width="200">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="view(scope.row)">Detail</el-button>
        <el-button link type="primary" size="small" @click="edit(scope.row)">Edit</el-button>
        <el-button link type="primary" size="small" @click="remove(scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="showAddDialog" :title="`${dialogTitle} Gateway`">
    <el-form :model="newGateway">
      <el-form-item label="name" label-width="140px">
        <el-input v-model="newGateway.name" autocomplete="off"/>
      </el-form-item>

      <el-form-item label="serial number" label-width="140px">
        <el-input v-model="newGateway.serial_number" autocomplete="off"/>
        <div v-if="newGateway.errors.ipv4" class="el-form-item__error">Check this</div>
      </el-form-item>

      <el-form-item label="ipv4 address" label-width="140px">
        <el-input v-validate="'ip'" data-vv-as="ip" v-model="newGateway.ipv4" autocomplete="off"/>
        <div v-if="checkFail('ipv4')" class="el-form-item__error">Check this</div>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addOrEdit">Accept</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts">
import {navigateTo} from "#app";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";

export default {
  name: 'gateway index',
  data() {
    return {
      loading: true,
      gateways: [],
      showAddDialog: false,
      newGateway: {
        name: '',
        serial_number: '',
        ipv4: '',
        errors: []
      },
      dialogTitle: 'New',
      editGateway: false,
      gatewayForEdit: '',
      submitted: false,
    }
  },
  methods: {
    addNew() {
      this.cleanEntity()
      this.dialogTitle = "New";
      this.showAddDialog = true;
    },
    addOrEdit() {
      this.submitted = true;
      if (this.checkFail('ipv4')) return;
      const uri = this.editGateway ? `/gateway/${this.gatewayForEdit}` : `/gateway`;
      const method = this.editGateway ? "PATCH" : "POST";
      const message = this.editGateway ? "gateway edited" : "gateway registered";
      $fetch(uri, {
        method: method,
        body: this.newGateway
      }).then((res) => {
        if (this.editGateway) {
          const index = this.gateways.findIndex((g) => g._id === res._id);
          this.gateways[index] = res;
        } else {
          this.gateways.push(res);
        }
        this.cleanEntity();
        this.showAddDialog = false;
        this.editGateway = false;
        this.submitted = false;
        this.newGateway.errors = [];
        this.showNotification('Info', message)
      }).catch((err) => {
        debugger
        if (err.status === 409) {
          this.newGateway.errors['ipv4'] = true;
          this.showNotification('Error', err.data.message)
        }
      });
    },
    view(data) {
      navigateTo(`/gateway/${data._id}`)
    },
    edit(data) {
      this.editGateway = true;
      this.dialogTitle = 'Edit';
      this.gatewayForEdit = data._id;
      this.newGateway.name = data.name;
      this.newGateway.serial_number = data.serial_number;
      this.newGateway.ipv4 = data.ipv4;
      this.showAddDialog = true;
    },
    remove(data) {
      ElMessageBox.confirm(
          'this action will delete the gateway and its devices, Are you sure you want to continue with this?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
      )
          .then(() => {
            this.deleteGateway(data);
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: 'Delete canceled',
            })
          })
    },
    deleteGateway(data) {
      $fetch(`/gateway/${data._id}`, {
        method: "DELETE"
      }).then((res) => {
        this.gateways = this.gateways.filter((g) => g._id !== res._id)
        this.showNotification('Info', 'the gateway and its devices have been removed')
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
      this.editGateway = false;
      this.newGateway.name = '';
      this.newGateway.serial_number = '';
      this.newGateway.ipv4 = '';
    },
    checkFail(component: string): boolean {
      let componentFail = false;
      switch (component) {
        case 'ipv4':
          const ipv4_regex_str = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;
          const ipv4_regex = new RegExp(ipv4_regex_str);
          componentFail = this.submitted && (
              !this.newGateway.ipv4 ||
              !ipv4_regex.test(this.newGateway.ipv4)
          );
          break;
        default:
          console.log('check not validate: ', component)
      }
      return componentFail
    }
  },
  mounted() {
    $fetch('/gateway').then((res) => {
      this.gateways = res
      this.loading = false;
    });
  }
}
</script>
