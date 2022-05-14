<template>
  <v-container>
    <v-row>
      <v-col>
        금액 입금
        <v-text-field
          label="Amount"
          value="1000"
          prefix="₩">
        </v-text-field>
        <v-btn
          color='blue'
          dark>
          입금
        </v-btn>
      </v-col>
      <v-col>
        <v-btn>
          비밀번호 초기화
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color='error'>
          사용자 삭제
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="accounts"
            :page.sync="page"
            :items-per-page='itemsPerPage'
            hide-default-footer
            mobile-breakpoint='0'
            class="elevation-1"
            @page-count="pageCount = $event"
          >
          <template v-slot:[`item.isChecked`]="{ item }">
            <v-simple-checkbox
              v-model="item.isChecked"
              :on-icon="'check_box'"
              :off-icon="'check_box_outline_blank'"
              color='primary'
            ></v-simple-checkbox>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :length="pageCount"
            prev-icon="chevron_left"
            next-icon="chevron_right">
          </v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      headers: [
        {
          text: '아이디',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: '잔액 (₩)',
          value: 'balance'
        },
        {
          text: '선택',
          value: 'isChecked'
        }
      ],
      accounts: [
        {
          name: '소은',
          balance: 100,
          isChecked: true
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: true
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: false
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: false
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: false
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: false
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: false
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: false
        },
        {
          name: '성윤',
          balance: 100,
          isChecked: false
        }
      ]
    }
  },
  methods: {
    numeberWithComma (num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style scoped>

</style>
