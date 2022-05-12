<template>
  <div>
    <v-container>
    <v-row>
      <v-col>
        <div
          class="mb-5 justify-space-between"
          v-for='(market, index) in markets'
          :key='index'>
          <v-card
            :color='colorList[index % 4]'
            dark
          >
            <v-card-title class="text-h5">
              {{market.title}}
            </v-card-title>

            <v-card-subtitle>
              {{market.numParticipant}}명 참여중
            </v-card-subtitle>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2 mb-3"
                outlined
                rounded
                :to="{
                  name: 'login',
                  params: {
                    marketId: market.id
                  }
                }">
                참여하기
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // Card Color List
      colorList: [
        '#93748A',
        '#AE7E32',
        '#395c6b',
        '#6b4e71'
      ],
      // TODO: it should fetch market metadata from backend
      markets: [
        {
          id: 1,
          title: '여주초 1학년 1반 시장',
          numParticipant: 11
        },
        {
          id: 2,
          title: '여주초 2학년 2반 시장',
          numParticipant: 11
        },
        {
          id: 3,
          title: '여주초 3학년 3반 시장',
          numParticipant: 11
        }
      ]
    }
  }
}
</script>

<style scoped>
.title {
  size: 10px;
}
.v-card__subtitle {
  text-align: left;
}
</style>
