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
                rounded>
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
          title: '여주초 5학년 5반 시장',
          numParticipant: 11
        },
        {
          title: '여주초 5학년 5반 시장',
          numParticipant: 11
        },
        {
          title: '여주초 5학년 5반 시장',
          numParticipant: 11
        },
        {
          title: '여주초 5학년 5반 시장',
          numParticipant: 11
        },
        {
          title: '여주초 5학년 5반 시장',
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
