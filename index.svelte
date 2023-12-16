<script lang="ts">
    export let title: string;

    // TODO: Transfer filter options as props
    const groupPeriodFilter = Object.freeze({
        day: "day",
        week: "week",
        month: "month",
        year: "year"
    })
</script>

<div class="container">
    <div class="heading">
        <h2 class="heading__title">{title}</h2>
        <div class="heading__filters">
            <select name="group-period-filter">
                {#each Object.entries(groupPeriodFilter) as [filterKey, filterValue]}
                    <option value="${filterValue}">{filterKey}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="body">
        <div class="panels">
            <h3 class="panels__title">Dashboard</h3>
            <div class="panels__content">
                <div class="panel panel__gains">
                    <p class="panel__title">Gains</p>
                    <!-- TODO: Move Currency to currency options -->
                    <!-- TODO: Move value to props -->
                    <p class="panel__value"><span class="panel__currency">PHP</span> 2000</p>
                </div>
                <div class="panel panel__expenses">
                    <p class="panel__title">Expenses</p>
                    <p class="panel__value"><span class="panel__currency">PHP</span> 1000</p>
                </div>
                <div class="panel panel__debts">
                    <p class="panel__title">Debt</p>
                    <p class="panel__value"><span class="panel__currency">PHP</span> 500</p>
                </div>
                <div class="panel panel__assets">
                    <p class="panel__title">Assets</p>
                    <p class="panel__value">XXXX</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .heading__title {
        font-size: 1.5rem;
        line-height: 1rem;
    }

    .body {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .panels {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .panels__title {
        font-size: 1.05rem;
        line-height: 1rem;
        margin: 0.1rem;
        text-align: center;
    }

    .panels__content {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .panel {
        flex: 1;
        margin: 0.4rem;
        padding: 0.4rem;
        border-style: solid;
        border-color:rgb(156 163 175);
        border-radius: 0.5rem;
    }

    .panel__title {
        font-size: 0.60rem;
        line-height: 0.4rem;
        margin-top: 0;
    }

    .panel__value {
        font-size: 1.25rem;
        text-align: center;
        font-weight: bold;
    }

    .panel__currency {
        font-size: 0.75rem;
        color: rgb(156 163 175);
    }

    .panel__gains .panel__value  {
        color: rgb(74 222 128);
    }

    .panel__expenses .panel__value {
        color: rgb(248 113 113);
    }

    .panel__debts .panel__value {
        color: rgb(248 113 113);
    }

</style>