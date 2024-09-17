import { ScrollView, Text, View, StyleSheet } from "react-native";
import { ModulesAllItem } from "./ModulesAllItem";

export const ModulesAllList = ({ modules }) => {
    return (
      <ScrollView>
          {
              modules.length
                ? modules.map((module) => {
                    return (
                      <ModulesAllItem key={module.id} module={module} />
                    )
                })
                : <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You haven't added any topics to study yet.</Text>
                    <Text style={styles.emptyText}>You can find a topic that interests you in All Topics</Text>
                </View>
          }

      </ScrollView>
    )
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
    },
});
